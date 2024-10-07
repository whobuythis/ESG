module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node" : true,
    },
    "extends": [
        "eslint:recommended",
        //"plugin:vue/essential"
        "plugin:vue/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-unused-vars": "off",
        'vue/multi-word-component-names': 'off',
    },
};
