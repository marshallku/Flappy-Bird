export const user: user = {
    score: 0,
    renderStars: true,
};

export function getUserData() {
    const localData = localStorage.getItem("flappy-user");
    if (!localData) return;

    try {
        const parsed = JSON.parse(localData);

        user.score = parsed.score;
        user.renderStars = parsed.renderStars;
    } catch (error) {
        console.error(error);
    }
}

export function saveUserData() {
    localStorage.setItem("flappy-user", JSON.stringify(user));
}
