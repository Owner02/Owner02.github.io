// scripts/save.js
const REPO_OWNER = 'owner02';
const REPO_NAME = 'WeekEnd';
const REPO_PATH = 'data/places.json';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REPO_PATH}`;

export async function loadPlaces() {
    try {
        const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${REPO_PATH}`;
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error('Не удалось загрузить данные');
        return await response.json();
    } catch (error) {
        console.warn('Не удалось загрузить данные из репозитория:', error);
        return null;
    }
}

export async function savePlaces(data, token) {
    if (!token) {
        console.error('Токен не предоставлен');
        return false;
    }
    try {
        const getResponse = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        let sha = null;
        if (getResponse.ok) {
            const fileInfo = await getResponse.json();
            sha = fileInfo.sha;
        }
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: '🔄 Обновление выбора мест',
                content: content,
                sha: sha
            })
        });
        if (response.ok) {
            console.log('✅ Данные сохранены в репозитории!');
            return true;
        } else {
            console.error('❌ Ошибка сохранения:', await response.json());
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        return false;
    }
}

export async function saveWithNotification(data, token) {
    const result = await savePlaces(data, token);
    if (result) {
        alert('✅ Ваш выбор сохранён! Данные обновлены.');
    } else {
        alert('❌ Не удалось сохранить изменения. Проверьте интернет-соединение.');
    }
    return result;
}
