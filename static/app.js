function summonChatBubble(role,content) {
    let ele = document.createElement("chat-bubble")
    ele.setAttribute("author",role);
    ele.innerHTML = content
    document.querySelector("chat-container").appendChild(ele)
}