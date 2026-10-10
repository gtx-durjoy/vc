// ==========================================================================
// VERCEL SERVERLESS DIRECT DISCORD ACTION DISPATCHER (ADVANCED ENGINE)
// ==========================================================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "MTU1ODE5MzQxNjkwNTY5NTI2Mg.GdR84P.ZYZPUOb8BsZEUG9A1UA3zN3uet0wyFOb3SvADs";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const { action, channelId, data } = req.body || {};

  if (!channelId) {
    return res.status(400).json({ error: 'channelId is required to dispatch action' });
  }

  try {
    // 1. Dispatch Luxury Welcome Test Card
    if (action === 'test-welcome') {
      const { bannerUrl, chatChannelId, rulesChannelId, serverName } = data || {};
      const chatMention = chatChannelId ? `<#${chatChannelId}>` : "our main chat";
      const rulesMention = rulesChannelId ? `<#${rulesChannelId}>` : "our rules channel";
      const banner = bannerUrl || "https://media.giphy.com/media/qXdb9xFp3cqYnqQ6RI/giphy.gif";

      const payload = {
        content: `<a:loading:1558328517844795392> Welcome to **${serverName || 'the server'}**!`,
        embeds: [
          {
            color: 0x5865F2,
            title: `<a:198907owner:1553651104124768307> Welcome to ${serverName || 'PLAY HEX'} <a:198907owner:1553651104124768307>`,
            description: [
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              `<a:msarrow:1558334689725644862> **WELCOME TO THE SERVER** <a:c_wave:1558336136290770974>\n`,
              `<a:AI_verify_certified_owo_lol_anim:1553468976338567259> **Enjoy Chatting In:** ${chatMention} 💬`,
              `<a:AI_verify_certified_owo_lol_anim:1553468976338567259> **Check Server Rules:** ${rulesMention} 📜`,
              `<a:AI_verify_certified_owo_lol_anim:1553468976338567259> **Important News & Updates:** <a:Announce:1558339943909032068>\n`,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              `<a:ie_black_cranium:1558328574916698132> You are a valued member of our elite community!`
            ].join('\n'),
            image: { url: banner },
            footer: {
              text: "LUNA 3D Console • Dispatched via Web Dashboard",
              icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Discord error' });
      }

      return res.status(200).json({ success: true, message: 'Luxury Welcome Card dispatched to Discord!' });
    }

    // 2. Dispatch Luxury Leave Test Card
    if (action === 'test-leave') {
      const { bannerUrl, serverName } = data || {};
      const banner = bannerUrl || "https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif";

      const payload = {
        content: `<a:c_wave:1558336136290770974> **[Dashboard Test] Goodbye!**`,
        embeds: [
          {
            color: 0xED4245,
            title: `🚪 Member Left • ${serverName || 'PLAY HEX'}`,
            description: [
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              `<a:msarrow:1558334689725644862> **A member has departed from the server.** <a:c_wave:1558336136290770974>\n`,
              `<a:736775redcheck:1553470739380961472> We hope you had a wonderful time with us and return soon.\n`,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              `<a:ie_black_cranium:1558328574916698132> Farewell from all of us!`
            ].join('\n'),
            image: { url: banner },
            footer: {
              text: "LUNA 3D Console • Dispatched via Web Dashboard",
              icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Discord error' });
      }

      return res.status(200).json({ success: true, message: 'Leave Log Card dispatched to Discord!' });
    }

    // 3. Dispatch Custom Announcement Embed
    if (action === 'announce') {
      const { title, message, color, bannerUrl } = data || {};
      const hexColor = parseInt(color ? color.replace('#', '') : '5865F2', 16);

      const payload = {
        embeds: [
          {
            color: hexColor,
            title: `<a:Announce:1558339943909032068> ${title || 'Official Announcement'}`,
            description: message || "No content provided.",
            image: bannerUrl ? { url: bannerUrl } : undefined,
            footer: {
              text: "Published via LUNA 3D Studio",
              icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Discord error' });
      }

      return res.status(200).json({ success: true, message: 'Announcement published successfully to Discord!' });
    }

    // 4. Deploy Interactive Support Ticket Panel (NEW!)
    if (action === 'deploy-ticket') {
      const { title, description } = data || {};

      const payload = {
        embeds: [
          {
            color: 0x5865F2,
            title: `<a:tickets:1422971964091273388> ${title || 'Support & Assistance Portal'}`,
            description: [
              description || "Need support, claim rewards, or contact management? Click the button below to initialize a confidential private ticket channel with staff.\n",
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              "🔒 **Strict Privacy:** Tickets are visible only to you and administrators.",
              "⚡ **Fast Response:** Average response time under 15 minutes."
            ].join('\n'),
            footer: { text: "LUNA Automated Ticket Dispatcher" },
            timestamp: new Date().toISOString()
          }
        ],
        components: [
          {
            type: 1, // ActionRow
            components: [
              {
                type: 2, // Button
                style: 1, // Primary (Blurple)
                label: "Create Ticket",
                custom_id: "ticket_create_btn",
                emoji: { name: "tickets", id: "1422971964091273388", animated: true }
              }
            ]
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Failed to deploy ticket panel' });
      }

      return res.status(200).json({ success: true, message: 'Support Ticket Panel deployed to Discord channel!' });
    }

    // 5. Launch Live Giveaway (NEW!)
    if (action === 'launch-giveaway') {
      const { prize, durationMinutes, winnersCount } = data || {};
      const endTimestamp = Math.floor(Date.now() / 1000) + (parseInt(durationMinutes || 60) * 60);

      const payload = {
        embeds: [
          {
            color: 0xF1C40F,
            title: `🎉 GIVEAWAY: ${prize || 'Discord Nitro 1 Month'}`,
            description: [
              `Click the button below to enter and compete for **${prize || 'Nitro'}**!\n`,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              `⏱️ **Ends:** <t:${endTimestamp}:R> (<t:${endTimestamp}:f>)`,
              `👑 **Winners:** **${winnersCount || 1}**`,
              `💎 **Hosted via:** LUNA Web Studio`
            ].join('\n'),
            footer: { text: "Click Join Giveaway below to enter!" },
            timestamp: new Date().toISOString()
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3, // Success Green
                label: "Join Giveaway (0)",
                custom_id: "giveaway_join_btn",
                emoji: { name: "🎉" }
              }
            ]
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Failed to launch giveaway' });
      }

      return res.status(200).json({ success: true, message: `Giveaway for '${prize}' successfully launched!` });
    }

    // 6. Security Lockdown Alert (NEW!)
    if (action === 'lockdown') {
      const { reason } = data || {};

      const payload = {
        embeds: [
          {
            color: 0xED4245,
            title: `🚨 EMERGENCY SERVER LOCKDOWN ACTIVATED`,
            description: [
              `**Reason:** ${reason || 'Security protocol initiated by administration.'}\n`,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              "⚠️ Public message permissions have been temporarily restricted.",
              "🛡️ Please standby while administrators review server safety."
            ].join('\n'),
            footer: { text: "LUNA Defense Matrix" },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return res.status(200).json({ success: true, message: 'Lockdown broadcast sent to Discord channel!' });
    }

    // 7. Deploy Member Verification Panel (NEW!)
    if (action === 'deploy-verification') {
      const { title, description, roleId } = data || {};

      const payload = {
        embeds: [
          {
            color: 0x2ECC71,
            title: `<a:AI_verify_certified_owo_lol_anim:1553468976338567259> ${title || 'Server Member Verification Portal'}`,
            description: [
              description || "Welcome! To gain full access to this server, read our rules and click the button below to verify yourself instantly.\n",
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
              "✅ **Instant Access:** Unlocks all server text & voice channels.",
              "🛡️ **Automated Security:** Powered by LUNA Web Matrix."
            ].join('\n'),
            footer: { text: "LUNA Verification System" },
            timestamp: new Date().toISOString()
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3, // Green
                label: "Verify & Get Access",
                custom_id: `verify_member_${roleId || 'default'}`,
                emoji: { name: "✅" }
              }
            ]
          }
        ]
      };

      const sendResp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const err = await sendResp.json();
        return res.status(sendResp.status).json({ error: err.message || 'Failed to deploy verification panel' });
      }

      return res.status(200).json({ success: true, message: 'Verification portal deployed to Discord channel!' });
    }

    // 8. Direct Channel Slowmode Modifier (NEW!)
    if (action === 'slowmode') {
      const { seconds } = data || {};
      const cooldown = parseInt(seconds || 0, 10);

      const patchResp = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_limit_per_user: cooldown })
      });

      if (!patchResp.ok) {
        const err = await patchResp.json();
        return res.status(patchResp.status).json({ error: err.message || 'Failed to update channel slowmode' });
      }

      return res.status(200).json({ 
        success: true, 
        message: cooldown === 0 ? 'Slowmode turned OFF successfully!' : `Slowmode set to ${cooldown} seconds!` 
      });
    }

    return res.status(400).json({ error: 'Unknown action type' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
