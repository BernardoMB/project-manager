var request = require('request');

var options = {
    method: 'POST',
    url:
        'https://api.bitbucket.org/2.0/repositories/kantostudio/pruebistles3/src',
    headers:
    {
        authorization: 'Basic QmVybmFyZG9NQktTOjE0Mzc0My0zOTkz',
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    formData:
        { 'C:\\Users\\bmond\\Documents\\Programming\\project-manager\\files\\README.md': 'README.md' }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log('Todo chido!');
    console.log(body);
});
