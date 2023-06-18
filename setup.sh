echo "Installing NPM package dependencies..."
npm i

echo "Building Thermite server..."
rm -rf dist
npx tsc

echo "Starting Thermite server..."
node .
