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
    let ele = document.createElement("chat-bubble")
    ele.setAttribute("author",role);
    ele.innerHTML = `<h5>${role.charAt(0).toUpperCase() + role.slice(1)}</h5>${mde ? md.render(content) : content}`
    document.querySelector("chat-container").appendChild(ele)
    msgContext.push({"role":role, "content":content})
}

function delLastMsg() {
    msgContext.pop()
    let lastMsg = document.querySelector("chat-bubble:last-child");
    lastMsg.remove()
}

async function sendMessage() {
    let content = document.querySelector(".chatbox-textarea-input").value;
    document.querySelector(".chatbox-textarea-input").value = "";
    document.querySelector("button.send").disabled = true;
    summonChatBubble("pending",content);
    let modContx = msgContext;
    modContx.pop();
    modContx.push({"role":"user","content":content})
    try {
    let res = await fetch("/api/chat",{signal: AbortSignal.timeout(25000),"method":"POST","body":JSON.stringify({
        "messages": modContx
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