import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // Only allow access if a token exists
            // if (req.nextUrl.pathname.startsWith("/terminal")) {
            //     return !!token
            // }
            return true
        },
    },
})

export const config = {
    matcher: ["/terminal/:path*"],
}
