const triggerOpen = document.querySelectorAll('[trigger-button]');
const triggerClose = document.querySelectorAll('[close-button]');
const overlay = document.querySelectorAll('[data-overlay]');
let targetEl;

const openData = function () {
    if (targetEl) {
        targetEl.classList.remove('active');
        overlay.forEach(item => item.classList.remove('active'));
    }
};


for (let i = 0; i < triggerOpen.length; i++) {
    let currentId = triggerOpen[i].dataset.target,
        targetEl = document.querySelector(`#${currentId}`)
    const openData = function () {
        targetEl.classList.remove('active');
        overlay.classList.remove('active');
    }
    triggerOpen[i].addEventListener('click', function () {
        if (targetEl) {
            targetEl.classList.add('active');
            overlay.forEach(item => item.classList.add('active'));
        }

        // targetEl.classList.add('active');
        // overlay.classList.add('active');
    });

    // targetEl.querySelector('[close-button]').addEventListener('click', openData);
    overlay.forEach(function (overlayItem) {
        overlayItem.addEventListener('click', openData);
    });
    // overlay.addEventListener('click', openData);
}








//Mobile interface
const submenu = document.querySelectorAll('.child-trigger');
submenu.forEach((menu) => menu.addEventListener('click', function (e) {
    e.preventDefault();

    // Find the closest parent with the class 'has-child'
    const closestHasChild = this.closest('.has-child');

    // Toggle the 'active' class on the closest parent with the class 'has-child'
    if (closestHasChild) {
        closestHasChild.classList.toggle('active');
    }

    // Remove 'active' class from other '.has-child' elements
    document.querySelectorAll('.has-child').forEach((item) => {
        if (item !== closestHasChild && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
}));
//Slider

const swiper = new Swiper('.sliderbox', {
    loop: true,
    effect: 'fade',
    autoHeight: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});


//Carousel

const carousel = new Swiper('.carouselbox', {
    spaceBetween: 30,
    slidesPerView: 'auto',
    centerdSlides: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        481: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            centerdSlides: false,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            centerdSlides: false,
        },
        992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            centerdSlides: false,
        }
    }
});


//page-single

const thumbImage = new Swiper('.thumbnail-image', {
    //loop: true,
    direction: 'vertical',
    spaceBetween: 15,
    slidesPerView: 1,
    freeMode: true,
    watchSlidesProgress: true,
});
const mainImage = new Swiper('.main-image', {
    loop: true,
    autoHeight: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    thumbs: {
        swiper: thumbImage,
    },
});



//sorter
const sorter = document.querySelector('.sort-list');

if (sorter) {
    const sortLi = sorter.querySelectorAll('li');
    sorter.querySelector('.opt-trigger').addEventListener('click', function () {
        sorter.querySelector('ul').classList.toggle('show');
    });

    sortLi.forEach(item => item.addEventListener('click', function () {
        sortLi.forEach(li => {
            if (li !== this) {
                li.classList.remove('active');
            }
        });
        this.classList.add('active');
        sorter.querySelector('.opt-trigger span.value').textContent = this.textContent;
        sorter.querySelector('ul').classList.toggle('show');
    }));
}

//tabbed 
const trigger = document.querySelectorAll('.tabbed-trigger');
const content = document.querySelectorAll('.tabbed>div');

trigger.forEach((btn) => {
    btn.addEventListener('click', function () {
        let dataTarget = this.dataset.id,
            body = document.querySelector(`#${dataTarget}`);
        trigger.forEach((b) => b.parentNode.classList.remove('active'));
        content.forEach((s) => s.classList.remove('active'));
        this.parentNode.classList.add('active');
        body.classList.add('active');
    });
});


//search enter
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const closeButton = document.getElementById("closeButton");
    const productNameInput = document.getElementById("productName");
    closeButton.addEventListener("click", function () {
        productNameInput.value = '';
    });
    productNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTerm = productNameInput.value;
        console.log("Search term:", searchTerm);
    });
});

function clearForm() {
    var form = document.getElementById("filter_form");
    form.reset();
}

function selectColor(color) {
    // Get the clicked color button
    var selectedButton = document.querySelector('.color-button.' + color);

    // Check if the button is currently selected
    var isSelected = selectedButton.classList.contains('selected');

    // Get all color buttons
    var colorButtons = document.querySelectorAll('.color-button');

    // Deselect all color buttons
    colorButtons.forEach(function (button) {
        button.classList.remove('selected');
        button.style.boxShadow = 'none'; // Remove the box shadow for all buttons
    });

    // If the button was not selected, select it; otherwise, return to the initial state
    if (!isSelected) {
        selectedButton.classList.add('selected');
        selectedButton.style.boxShadow = 'inset 0 0 0 4px var(--white-color)';
    }
}