const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        des: { type: GraphQLString }
    }
})

 const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parent, args) {
                return axios(`http://localhost:3000/companies/${parent.companyId}`)
                    .then( res => res.data )
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString }
            },
            resolve( parent, args ) {
                return axios(`http://localhost:3000/users/${args.id}`)
                            .then( res => res.data )
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return axios(`http://localhost:3000/users/`)
                            .then( res => res.data )
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});