export class UsersDBService {
    async getUserByMail(mail) {
        try {
            user = (await this.spark.get(`users/email/${mail}`, req)).data;
            await this.initialLogin.initUser(user, req);
            user.permissions = await services.permissions.getPermissionsForUsers([user.user_id]);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { user, currentEventId: req.cookies[this.config.JWT_KEY].currentEventId}));
        } catch (e) {
            console.log(e.stack)
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, {error: e.stack, baseData, user}));
        }
    }
}

module.exports = new UsersDBService();