const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_SHIELD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('盾牌')
        .setDescription('查盾牌價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢盾牌價格')
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
                )    
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('更新')
                .setDescription('更新盾牌價格')
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
                )
                .addStringOption(option => 
                    option.setName('更新價格為')
                        .setDescription('輸入要更新的價格')
                        .setRequired(true)
                )    
        )
        ,

    async execute(interaction) {
        try {
            if (interaction.options.getSubcommand() === '查詢') {
                await interaction.reply({ content: '取得資料中...', ephemeral: true });
    
                const search = interaction.options.getString('盾牌');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_SHIELD_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('盾牌');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_SHIELD_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
