const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

const PORT = process.env.PORT || 5000;

app.listen(4000, () => {
    console.log(`going on ${PORT}`);
});