const { Good, Auction , User, sequelize } = require('./models');
const schedule = require('node-schedule');

module.exports = async () => {
    try {
        const targets = await Good.findAll({
            where : {soldId : null},
        });

        targets.forEach(async (target) => {
            const end = new date(target.createdAt);
            end.setHours(end.getHours() + target.end);
            if ( new Date() > end) { // 낙찰되어야 하는데 안된것들
            const success = await Auction.find({
                where : { goodId : target.id},
                order : [['bid', 'DESC']],
            });
            if (success) { //낙찰자가 있을때
            await Good.update({ soleId : success.userId }, { where :{ id : target.id }});
            await User.update({
                money : sequelize.literal(`money - ${success.bid}`),
            }, 
            {
                where : { id : success.userId },
            });
            } else { //낙찰자가 없을때
                await Good.update({ soldId : target.ownerId }, { where : { id : target.id}});
            }
          } else {  //경매가 진행중인거
            schedule.scheduledJobs(end, async () => {
                const success = await Auction.find({
                    where : { goodId : target.id},
                    order : [['bid', 'DESC']],
                });
                if (success) { //낙찰자가 있을때
                await Good.update({ soldId : success.userId }, { where :{ id : target.id }});
                await User.update({
                    money : sequelize.literal(`money - ${success.bid}`),
                }, {
                    where : { id : success.userId },
                });
                } else { //낙찰자가 없을때
                    await Good.update({ soldId : target.ownerId }, { where : { id : target.id}});
                }
            });
          }
        });
    } catch(error) {
        console.log(error);
    }
};