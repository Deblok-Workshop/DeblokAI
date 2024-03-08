let msgContext = []

function summonChatBubble(role,content) {
    let ele = document.createElement("chat-bubble")
    ele.setAttribute("author",role);
    ele.innerHTML = content
    document.querySelector("chat-container").appendChild(ele)
    msgContext.push({"role":role, "content":content})
}

function delLastMsg() {
    msgContext = msgContext.pop()
    let lastMsg = document.querySelector("chat-bubble:last-child");
    lastMsg.remove()
}

function sendMessage() {}