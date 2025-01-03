function toastCalling(msg, flag){

    let color = "gray";
    flag === 0 ? color = "red" : color = "green";

    Toastify({
        text: msg,
        duration: 1000,
        gravity: "top",
        position: "center",
        backgroundColor: color,
        stopOnFocus: true,
    }).showToast();

}


function timeAgo(dateString) {

    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // Difference in seconds

    if (diff < 60) return "just now";

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);

    if (days < 30) return `${days} days ago`;
    
    const months = Math.floor(days / 30);

    if (months < 12) return `${months} months ago`;

    const years = Math.floor(months / 12);

    return `${years} years ago`;
}