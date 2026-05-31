/* global $ location document */

$(() => {
    $('<style>', {
        text: `
.tutorial-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.97);
    border: 2px solid #a5d6a7;
    border-radius: 12px;
    padding: 24px 32px;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    text-align: center;
    max-width: 480px;
    width: 90%;
    color: #2e7d32;
    font-size: 1em;
    line-height: 1.6;
}
.tutorial-overlay p { margin: 0 0 6px; }
.tutorial-overlay-hint { font-size: .78em !important; color: #aaa !important; margin-top: 14px !important; }
        `
    }).appendTo('head');

    function showOverlay(html) {
        const overlay = $('<div>', {
            class: 'tutorial-overlay',
            html: html + '<p class="tutorial-overlay-hint">何かキーを押して進む</p>',
        });
        $('body').append(overlay);

        function dismiss(e) {
            if (e.which === 0 || e.which === 16 || e.which === 17 || e.which === 18) return;
            $(document).off('keydown.tutorial-overlay');
            overlay.fadeOut(200, () => overlay.remove());
        }
        $(document).on('keydown.tutorial-overlay', dismiss);
    }

    const isTutorialHome = location.pathname === '/tutorial' || location.pathname === '/tutorial/';
    const isTutorialMan  = /^\/tutorial\/.+/.test(location.pathname);

    if (isTutorialHome) {
        showOverlay('<p>🎓 ようこそ！</p><p>まず <strong>「a」</strong> をタイプして始めましょう。<br>他のお題もいつでも選べます。</p>');

        $('#selection').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const man = $(this).data('command') || $(this).text().trim();
            location.href = '/tutorial/' + encodeURIComponent(man);
        });
    }

    if (isTutorialMan) {
        showOverlay('<p>🎓 チュートリアル</p><p>タイピングが終わったら、<br>あなたの <strong>名前</strong> を入力して Enter を押してください。</p>');

        $(document).on('typing-man:submitted', (_, name) => {
            setTimeout(() => {
                location.href = '/user/' + encodeURIComponent(name) + '?tutorial=1';
            }, 600);
        });
    }
});
