let prompts = {"default":"You are a helpful assistant called DeblokAI. Respond informally and be very concise (minimum 6 words, maximum 250 words) unless you are told otherwise. You may use emojis and markdown when needed, but only use emojis sparingly (limit 1 emoji per message).",
"arbys_employee":"Pretend to be a Arby's employee who doesn't care about anything during your eternal shift at Arby's and is just trying to get through your shift. Always be very rude, disrespectful, and impatient to customers ordering at Arby's.  Be sure to state that you're an arbys employee when someone says hi. ALWAYS be mean.","linux_terminal":"I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. ","javascript_console":"INTERNAL_ACTUAL_JAVASCRIPT_CONSOLE"
}

let currentPrompt = "default";

// polyfill
AbortSignal.timeout ??= function timeout(ms) {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), ms)
    return ctrl.signal
  }

 let md = markdownit({
    html: false, // to be on the safe side
    linkify: true,
    typographer: true
  })



let msgContext = []

function summonChatBubble(role,content,mde = true) {
    if (role == "user" || role == "assistant" || role == "system") { // do not add special types of messages
        msgContext.push({"role":role, "content":content});
        } else if (role == "pending") {
            msgContext.push({"role":"user", "content":content}); // handle pending msgs as user msgs
        }
    let ele = document.createElement("chat-bubble")
    ele.setAttribute("author",role);
    ele.innerHTML = `<h5>${role.charAt(0).toUpperCase() + role.slice(1)}</h5>${mde ? md.render(content) : content}`
    document.querySelector("chat-container").appendChild(ele)
    
    hljs.highlightAll();
}

function delLastMsg() {
    msgContext.pop()
    let lastMsg = document.querySelector("chat-bubble:last-child");
    lastMsg.remove()
}

async function sendMessage() {
    
    let content = document.querySelector(".chatbox-textarea-input").value;
    document.querySelector(".chatbox-textarea-input").value = "";
    document.querySelector("chat").scrollTop = document.querySelector("chat").scrollHeight;
    if (content.length < 2) {
        document.querySelector("button.send").disabled = true;
        summonChatBubble("error","Message not sent: Message too small.");
        setTimeout(() => {delLastMsg();document.querySelector("button.send").disabled = false;},1000)
        
        return;
    }
    if (content.length > 4096) {
        document.querySelector("button.send").disabled = true;
        summonChatBubble("error","Message not sent: Message too big.");
        setTimeout(() => {delLastMsg();document.querySelector("button.send").disabled = false;},1000)
        
        
        return;
    }
    
    document.querySelector("button.send").disabled = true;
    if (currentPrompt == "javascript_console") {
        let r;
        summonChatBubble("user",content)
        try {
        r = eval(content);
        if (content.includes("console.log")) {
            summonChatBubble("info","Check console for output of `console.log`",true)
        }
        setTimeout(() => {summonChatBubble("assistant",`\`\`\`\n${r}\n\`\`\``,true)},300)
        
        } catch (r) {summonChatBubble("assistant",r,false)}
        document.querySelector("button.send").disabled = false;
        return;
    }
    summonChatBubble("pending",content);
    try {
    let res = await fetch("/api/chat",{signal: AbortSignal.timeout(25000),"method":"POST","body":JSON.stringify({
        "messages": msgContext, "prompt": prompts[currentPrompt], "model":document.querySelector('.modelSelector').value
        })})
   
    delLastMsg();
    summonChatBubble("user",content);
    if (res.ok) {
    summonChatBubble("assistant",await res.text());
    } else {
        console.error("Server returned an error!")
        console.error(`HTTP ${res.status}`)

        console.error(`Response (trimmed to first 500 characters): ${(await res.text()).substring(0,500)}`)
        summonChatBubble("error",`Server returned an error.<br><code>HTTP ${res.status}\nCheck console!</code>`,false);}
    document.querySelector("button.send").disabled = false;
} catch (e) {
    delLastMsg();
    document.querySelector("button.send").disabled = false;
    console.error(`Failed to send request!\n${e}`)
    summonChatBubble("error",`Failed to send request. <br> <code>${e}\nCheck console!</code>`,false);
    return;
}
}

function switchPrompt(prompt) {
    if (prompt in prompts) {
        currentPrompt = prompt;
        summonChatBubble("info",`Switched to \`${prompt}\` prompt. `,true)
    } else {
        summonChatBubble("error","Invalid prompt. Switching to `default`.",true)
        currentPrompt = "default";
        
    }
}

const selectMenu = document.querySelector('.promptSelector');


Object.keys(prompts).forEach(prompt => {
    const option = document.createElement('option');
    option.text = prompt;
    selectMenu.add(option);
  });
  selectMenu.addEventListener('change', function() {
      const selectedPrompt = this.value;
      switchPrompt(selectedPrompt);
    });

const modelselectMenu = document.querySelector('.modelSelector');

fetch('/api/models')
  .then(response => response.json())
  .then(models => {
    Object.values(models).forEach(model => {
      const option = document.createElement('option');
      option.text = model;
      modelselectMenu.add(option);
    });
  });
modelselectMenu.addEventListener('change', function() {
    summonChatBubble("info",`Switched to \`${modelselectMenu.value}\` model. `,true)
  });