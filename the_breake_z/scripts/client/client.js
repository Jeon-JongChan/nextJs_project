function changeTab(query) {
    let oldTab = document.querySelector(".activate-tab");
    let newTab = document.querySelector(query);
    if (oldTab) {
        oldTab.classList.add("hidden");
        oldTab.classList.remove("activate-tab");
    }
    if (newTab) {
        newTab.classList.remove("hidden");
        newTab.classList.add("block");
        newTab.classList.add("activate-tab");
    }
}
function copyToClipBoard(query) {
    var content = document.querySelector(query).innerText;

    navigator.clipboard
        .writeText(content)
        .then(() => {
            alert("텍스트만 복사되었습니다.");
            console.log("Text copied to clipboard...");
        })
        .catch((err) => {
            console.log("Something went wrong", err);
        });
}
export { changeTab, copyToClipBoard };
