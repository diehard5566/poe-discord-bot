const { SlashCommandBuilder } = require('discord.js');
const { transitionTimelessJewelURL } = require('../controller/timeless-jewel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('國際服市集網址')
        .setDescription('輸入國際服市集網址')
        .addStringOption(option => 
            option.setName('網址')
                .setDescription('輸入網址')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: false });

            const search = interaction.options.getString('網址');

            const searchURLForTW = await transitionTimelessJewelURL(search);

            await interaction.editReply({ content: searchURLForTW, ephemeral: false });

        } catch (error) {
            console.log(error);
        }
    }
}
