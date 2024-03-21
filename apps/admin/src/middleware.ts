export { auth as default } from './config/auth'

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  unstable_allowDynamic: [
    '**/node_modules/saml2-js/**',
    '**/node_modules/underscore/**',
    '**/node_modules/xmlbuilder2/**',
  ],
}
