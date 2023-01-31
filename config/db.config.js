const  dotenv  = require( 'dotenv');
const  path  = require( 'path');
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

module.exports = {
 MongooseURI : process.env['MONGOOSE_URI']
}