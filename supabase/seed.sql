-- insert default value for usage tier
INSERT INTO
public.usage_tier (display_name)
VALUES
('super'),
('regular');
-- insert default org
INSERT INTO
public.org (tier, tag, display_name)
VALUES
(1, 'rampable', 'Rampable'),
(2, 'lexupay', 'Lexupay');