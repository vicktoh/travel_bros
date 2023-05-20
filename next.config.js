/** @type {import('next').NextConfig} */
const nextConfig = {
   'output': 'export',
   'env':{
      PAY_STACK_KEY: process.env.PAY_STACK_KEY
   }
}

module.exports = nextConfig
