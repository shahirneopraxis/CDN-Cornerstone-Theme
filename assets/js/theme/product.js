/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from '../page-manager';
import Review from './product/reviews';
import collapsible from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import {classifyForm} from './common/form-utils';

export default class Product extends PageManager {
    constructor() {
        super();
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {

        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', function (event) {
            if (event.target.baseURI.indexOf('#writeReview') !== -1) {
                history.replaceState('', document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        // Init collapsible
        collapsible();

        new ProductDetails($('.productView'), this.context);

        videoGallery();

        this.productReviewHandler();

        let $reviewForm = classifyForm('.writeReview-form'),
            validator,
            review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation();
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#writeReview') !== -1) {
            this.$reviewLink.click();
        }
    }
}
