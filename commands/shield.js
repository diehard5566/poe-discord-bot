const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_SHIELD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('盾牌')
        .setDescription('查盾牌價格')
        .addStringOption(option => 
            option.setName('盾牌')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '巨石', value: '巨石'},
                    { name: '千钧一发', value: '千钧一发'},
                    { name: '灵魂堡垒', value: '灵魂堡垒'},
                    { name: '拉赫耶之光', value: '拉赫耶之光'},
                    { name: '终末深渊的堡垒', value: '终末深渊的堡垒'},
                    { name: '珊瑚盾', value: '珊瑚盾'},
                    { name: '生命之旅', value: '生命之旅'},
                    { name: '乌凯罗斯之角', value: '乌凯罗斯之角'},
                    { name: '冰封者的信仰', value: '冰封者的信仰'},
                    { name: '思维壁垒', value: '思维壁垒'},
                    { name: '荣誉堡垒', value: '荣誉堡垒'},
                    { name: '剥皮者之傲', value: '剥皮者之傲'},
                    { name: '荆棘之壳', value: '荆棘之壳'},
                    { name: '山之貌', value: '山之貌'},
                    { name: '被抹灭的摇篮', value: '被抹灭的摇篮'},
                    { name: '西革昂的报复', value: '西革昂的报复'},
            )
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('洞數')
                .setDescription('輸入洞數')
                .addChoices(
                    ...SOCKET_NUMBER.socketNumber
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: true });

            const search = interaction.options.getString('盾牌');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_SHIELD_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
