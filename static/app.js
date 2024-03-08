// polyfill
AbortSignal.timeout ??= function timeout(ms) {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), ms)
    return ctrl.signal
  }



let msgContext = []

function summonChatBubble(role,content) {
    let ele = document.createElement("chat-bubble")
    ele.setAttribute("author",role);
    ele.innerHTML = `<h5>${role.charAt(0).toUpperCase() + role.slice(1)}</h5>${content}`
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
    let res = await fetch("/api/chat",{signal: AbortSignal.timeout(8000),"method":"POST","body":JSON.stringify({
        "messages": modContx
        })})
    } catch (e) {
        document.querySelector("button.send").disabled = false;
        summonChatBubble("error",`Failed to send request. <br> <code>${e}</code>`);
        return;
    }
    delLastMsg();
    summonChatBubble("user",content);
    if (res.ok) {
    summonChatBubble("assistant",await res.text());
    } else {summonChatBubble("error",`Server returned an error.<br><code>HTTP ${response.statusCode}</code>`);}
    document.querySelector("button.send").disabled = false;
}