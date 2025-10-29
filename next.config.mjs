/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    staticPageGenerationTimeout: 0,
    output: 'standalone',
    turbopack: {
        // Ensure Next selects this folder as the workspace root during builds
        root: process.cwd(),
    },
}

export default nextConfig