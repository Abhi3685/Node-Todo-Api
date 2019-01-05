var bcrypt = require('bcryptjs');

var password = 'abc123!';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, function(err, hash) {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$bHwO35UdqS0mVCYNXH8K6eMtz2tBZILQr.wHVH0g6Orz74j5xA/k6';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});
