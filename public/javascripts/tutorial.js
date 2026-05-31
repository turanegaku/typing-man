/* global $ location document */

$(() => {
    $('<style>', {
        text: `
.tutorial-banner {
    background: #e8f5e9;
    border: 1px solid #a5d6a7;
    border-radius: 6px;
    padding: 8px 14px;
    color: #2e7d32;
    font-size: .92em;
}
        `
    }).appendTo('head');

    const isTutorialHome = location.pathname === '/tutorial' || location.pathname === '/tutorial/';
    const isTutorialMan  = /^\/tutorial\/.+/.test(location.pathname);

    if (isTutorialHome) {
        $('#info p').first().before(
            $('<p>', {
                class: 'tutorial-banner',
                html: 'まず「a」をタイプして始めましょう！',
            })
        );

        $('#selection').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const man = $(this).text().trim();
            location.href = '/tutorial/' + encodeURIComponent(man);
        });
    }

    if (isTutorialMan) {
        $('#info p').first().before(
            $('<p>', {
                class: 'tutorial-banner',
                html: '🎓 チュートリアル：タイピングが終わったら、あなたの名前を入力してください。',
            })
        );

        $(document).on('typing-man:submitted', (_, name) => {
            setTimeout(() => {
                location.href = '/user/' + encodeURIComponent(name) + '?tutorial=1';
            }, 600);
        });
    }
});
