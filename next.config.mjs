/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "static.wikia.nocookie.net",
            },
            {
                protocol: "https",
                hostname: "minbjiizkbkseyxkcvhs.supabase.co",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            },
        ],
    },
};

export default nextConfig;
