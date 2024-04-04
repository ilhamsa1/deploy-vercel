'use client'
import { useFetchOrganizationQuery } from '@/models/organizations/hooks'

// Example to call data
const Organizations = () => {
  const data = useFetchOrganizationQuery(1)

  return <div>{JSON.stringify(data)}</div>
}

export default Organizations
