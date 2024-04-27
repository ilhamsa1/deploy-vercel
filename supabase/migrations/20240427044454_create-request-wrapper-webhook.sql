CREATE TABLE request_tracker (
  method TEXT,
  url TEXT,
  params JSONB,
  body JSONB,
  headers JSONB,
  request_id BIGINT
);

CREATE OR REPLACE FUNCTION request_wrapper(
  method TEXT,
  url TEXT,
  params JSONB DEFAULT '{}'::JSONB,
  body JSONB DEFAULT '{}'::JSONB,
  headers JSONB DEFAULT '{}'::JSONB
)
RETURNS BIGINT
AS $$
DECLARE
  request_id BIGINT;
BEGIN
  IF method = 'DELETE' THEN
      SELECT net.http_delete(
          url:=url,
          params:=params,
          headers:=headers
      ) INTO request_id;
  ELSIF method = 'POST' THEN
      SELECT net.http_post(
          url:=url,
          body:=body,
          params:=params,
          headers:=headers
      ) INTO request_id;
  ELSIF method = 'GET' THEN
      SELECT net.http_get(
          url:=url,
          params:=params,
          headers:=headers
      ) INTO request_id;
  ELSE
      RAISE EXCEPTION 'Method must be DELETE, POST, or GET';
  END IF;

  INSERT INTO request_tracker (method, url, params, body, headers, request_id)
  VALUES (method, url, params, body, headers, request_id);

  RETURN request_id;
END;
$$
LANGUAGE plpgsql;

WITH retry_request AS (
  SELECT
      request_tracker.method,
      request_tracker.url,
      request_tracker.params,
      request_tracker.body,
      request_tracker.headers,
      request_tracker.request_id
  FROM request_tracker
  INNER JOIN net._http_response ON net._http_response.id = request_tracker.request_id
  WHERE net._http_response.status_code >= 500
  LIMIT 3
),
retry AS (
  SELECT
      request_wrapper(retry_request.method, retry_request.url, retry_request.params, retry_request.body, retry_request.headers)
  FROM retry_request
),
delete_http_response AS (
  DELETE FROM net._http_response
  WHERE id IN (SELECT request_id FROM retry_request)
  RETURNING *
)
DELETE FROM request_tracker
WHERE request_id IN (SELECT request_id FROM retry_request)
RETURNING *;
