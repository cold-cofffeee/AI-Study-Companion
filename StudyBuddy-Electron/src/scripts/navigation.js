// Navigation Controller
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const module = button.dataset.module;
            await loadModule(module);
        });
    });
});
