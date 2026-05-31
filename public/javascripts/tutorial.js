/* global $ location document */

$(() => {
    function showOverlay(html, autoDismissMs) {
        const overlay = $('<div>', {
            class: 'tutorial-overlay',
            html: autoDismissMs
                ? html
                : html + '<p class="tutorial-overlay-hint">何かキーを押して進む</p>',
        });
        $('body').append(overlay);

        if (autoDismissMs) {
            setTimeout(() => {
                overlay.fadeOut(200, () => overlay.remove());
            }, autoDismissMs);
            return;
        }

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
        showOverlay('<p>🎓 ようこそ！</p><p>まず <strong>「a」</strong> をタイプして始めましょう。</p>');

        $('#selection').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const man = $(this).data('command') || $(this).text().trim();
            location.href = '/tutorial/' + encodeURIComponent(man);
        });
    }

    if (isTutorialMan) {
        showOverlay('<p>🎓 チュートリアル</p><p>キーを入力してゲームを開始しましょう！</p>');

        $(document).on('typing-man:submitted', (_, name) => {
            showOverlay('<p>✅ 名前を登録しました：<strong>' + name + '</strong></p><p>ユーザーページでいつでも変更できます。</p>', 2000);
            setTimeout(() => {
                location.href = '/user/' + encodeURIComponent(name) + '?tutorial=1';
            }, 2000);
        });
    }
});
