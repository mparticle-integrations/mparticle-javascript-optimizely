var helpers = {
    arrayToObject: function(array, keyField) {
        var newObj = array.reduce(function(obj, item) {
            obj[item[keyField]] = item;
            return obj;
        }, {});
    return newObj;
    },
    loadScript: function(src, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = callback;
        script.src = src;
        document.head.appendChild(script);
    },
    getUserId: function(userIdField, userIdentities) {
        var userId;
        switch(userIdField) {
            case 'customerId':
                userId = userIdentities['customerId'];
                break;
            case 'email':
                userId = userIdentities['email'];
                break;
            case 'mpid':
                userId = userIdentities['mpid'];
                break;
            case 'other':
                userId = userIdentities['other'];
                break;
            case 'other2':
                userId = userIdentities['other2'];
                break;
            case 'other3':
                userId = userIdentities['other3'];
                break;
            case 'other4':
                userId = userIdentities['other4'];
                break;
            case 'deviceApplicationStamp':
                userId = window.mParticle.getDeviceId();
                break;
            default:
                // this should never hit, since a user is required to select from a userId type from the userIdField dropdown
                userId = null;
        }

        if (!userId) {
            userId = window.mParticle.getDeviceId();
        }
        return userId;
    },
};

module.exports = helpers;