const bcrypt = require('bcrypt');

const hashData = async(data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;

    } catch (error) {
        throw error;
    }
};

const compareData = async (hashedData, data) => {
    try {
        const match = await bcrypt.compare( data,hashedData);
        console.log("🚀 ~ compareData ~ match:", match)
        return match;
    } catch (error) {
        throw new Error("Error comparing data");
    }
}
module.exports =  {hashData, compareData} ;