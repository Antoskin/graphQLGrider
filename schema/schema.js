const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        des: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return axios.get(`http://localhost:3000/companies/${parent.id}/users`)
                    .then( res => res.data )
            }
        }
    })
});

 const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parent, args) {
                return axios(`http://localhost:3000/companies/${parent.companyId}`)
                    .then( res => res.data )
            }
        }
    })
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
        },
        company: {
            type: CompanyType,
            args: {
                id: { type: GraphQLString }
            },
            resolve( parent, args ) {
                return axios(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data)
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve() {
                return axios(`http://localhost:3000/companies`)
                    .then( res => res.data )
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args:  {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve( parent, { firstName, age, companyId } ) {
                return axios.post(`http://localhost:3000/users`, { firstName, age, companyId })
                    .then( res => res.data )
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve( parent, { id } ) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then( res => res.data )
            } 
        },
        addCompany: {
            type: CompanyType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                des: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, { name, des } ) {
                return axios.post(`http://localhost:3000/companies`, { name, des })
                    .then( res => res.data )
            }
        },
        removeCompany: {
            type: CompanyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, { id }) {
                return axios.delete(`http://localhost:3000/companies/${id}`)
                    .then( res => res.data )
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args )
                    .then( res => res.data )
            }
        },
        editCompany: {
            type: CompanyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                des: { type: GraphQLString },
            },
            resolve(parent, args) {
                return axios.patch(`http://localhost:3000/companies/${args.id}`, args)
                    .then( res => res.data )
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
