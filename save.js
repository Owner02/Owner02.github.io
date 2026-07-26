// Код для отправки изменений в репозиторий через GitHub API
async function saveToGitHub(data) {
    const token = 'YOUR_GITHUB_TOKEN'; // Нужно создать личный токен
    const repo = 'ваш-логин/название-репозитория';
    const path = 'data/places.json';
    
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    
    try {
        // Сначала получаем SHA текущего файла
        const getResponse = await fetch(url);
        const fileData = await getResponse.json();
        const sha = fileData.sha;
        
        // Отправляем обновлённые данные
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Обновление выбора мест',
                content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
                sha: sha
            })
        });
        
        if (response.ok) {
            console.log('Данные сохранены в репозитории!');
            return true;
        } else {
            console.error('Ошибка сохранения:', await response.text());
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}
