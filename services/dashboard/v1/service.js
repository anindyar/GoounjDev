/**
 * Created by catherinesamuel on 18/05/16.
 */

module.exports = {
    resources: [
        {
            name: 'dashboard',
            methods: require('./dashboard'),
            auth: 'bypass'
        }
    ]
};