
const createTeaserBlock = (main, document) => {
    const teaser = {};
    const cell = {'teaser': []};

    // IMAGE
    const image = document.querySelector('.feature-50-50__image img');
    if (image) {
        const el = document.createElement('img');
        el.src = image.src;
        teaser.Image = el;
    }

    // TITLE
    const title = document.querySelector('.feature-50-50__title');
    if (title) {
        teaser.Title = title.textContent.trim();
    }

    // DESCRIPTION
    const desc = document.querySelector('.feature-50-50__description');
    if (desc) {
        teaser.Description = desc.innerHTML.trim();
    }

    // CTA
    const cta = document.querySelector('.feature-50-50__links a');
    if (cta) {
        teaser.CTA = `<p><a href="${cta.href}">${cta.textContent.trim()}</a></p>`;
    }

    // BACKGROUND
    const wrapper = document.querySelector('.feature-50-50__wrapper');
    if (wrapper) {
        teaser.Background = wrapper.classList.contains('color-grad-red-plum-diag')
            ? 'bg-plum'
            : 'bg-default';
    }

    // const div = document.createElement('div');
    // div.append(teaser.Image);
    // div.append(teaser.Title);
    // div.append(teaser.Description);
    // div.append(teaser.CTA);
    // div.append(teaser.Background);
    const cells = [
        ['Teaser'],
        // [image, title,'','','',["image-on-left","bg-white"]],
        [image,title,'','',''],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.prepend(table);

    // // ⭐ Build Franklin block table manually
    // const rows = [
    //     ['teaser'], // block name row
    //     ['Image', teaser.Image || ''],
    //     ['Title', teaser.Title || ''],
    //     ['Description', teaser.Description || ''],
    //     ['CTA', teaser.CTA || '']
    //     // ['Background', teaser.Background || '']
    // ];

    // const table = WebImporter.DOMUtils.createTable(cell, document);

    // Append to main
    // main.append(table);

    // return teaser;
};


export default {
    transformDOM: ({ document }) => {
        const main = document.querySelector('.feature-50-50');
        console.log('main', main);
        createTeaserBlock(main, document);

        // // final cleanup
        // WebImporter.DOMUtils.remove(main, [
        //     '.disclaimer',
        // ]);

        return main;
    },
};