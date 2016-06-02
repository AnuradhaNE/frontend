const handler = require('../route-handlers/completed-task');

module.exports = {
    route: '/task/complete/:taskId',
    title: 'Completed Task',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};
