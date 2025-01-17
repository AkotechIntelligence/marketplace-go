// src/public/js/edit-product.js

// Initialize product data for Alpine.js
document.addEventListener('alpine:init', () => {
    Alpine.data('productForm', () => ({
        productOptions: <%= JSON.stringify(product.ProductOptions || []) %>,
        productFields: <%= JSON.stringify(product.ProductFields || []) %>,
        selectedCurrency: '<%= product.currencyCode %>',
        currentOption: { optionName: '', price: '', imageUrl: null },
        currentField: { fieldLabel: '', fieldType: '' },

        init() {
            this.initializeSubcategories();
            this.initializeImageUpload();
        },

        async initializeSubcategories() {
            const categoryId = document.getElementById('categoryUuid').value;
            if (categoryId) {
                await this.loadSubcategories(categoryId);
                document.getElementById('subCategoryUuid').value = '<%= product.subCategoryUuid %>';
            }
        },

        async loadSubcategories(categoryId) {
            try {
                const response = await fetch(`/api/product/subcategories/${categoryId}`);
                const data = await response.json();
                
                const subCategorySelect = document.getElementById('subCategoryUuid');
                subCategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
                
                data.data.forEach(subcategory => {
                    const option = document.createElement('option');
                    option.value = subcategory.uuid;
                    option.textContent = subcategory.name;
                    subCategorySelect.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading subcategories:', error);
                showErrorAlert('Error', 'Failed to load subcategories');
            }
        },

        initializeImageUpload() {
            const fileInput = document.getElementById('files');
            const preview = document.getElementById('imagePreview');
            
            fileInput.addEventListener('change', function(e) {
                preview.innerHTML = '';
                Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const div = document.createElement('div');
                        div.className = 'preview-image';
                        div.innerHTML = `
                            <img src="${event.target.result}" alt="Preview">
                            <button type="button" class="remove-image">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        preview.appendChild(div);
                    }
                    reader.readAsDataURL(file);
                });
            });
        },

        async handleSubmit(event) {
            try {
                const formData = new FormData(event.target);
                formData.append('productOptions', JSON.stringify(this.productOptions));
                formData.append('productFields', JSON.stringify(this.productFields));

                const response = await fetch('/merchant/product/<%= product.uuid %>/edit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    showSuccessAlert('Success', 'Product updated successfully');
                    setTimeout(() => window.location.href = '/merchant/products', 1500);
                } else {
                    throw new Error(data.message || 'Failed to update product');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorAlert('Error', error.message || 'Failed to update product');
            }
        }
    }));
});

// Function to delete product image
async function deleteProductImage(imageId) {
    try {
        const response = await fetch(`/api/merchant/products/images/${imageId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            window.location.reload();
        } else {
            showErrorAlert('Error', data.message || 'Failed to delete image');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorAlert('Error', 'Failed to delete image');
    }
}

// Initialize category change handler
document.getElementById('categoryUuid').addEventListener('change', async function() {
    const form = document.querySelector('[x-data="productForm"]').__x.$data;
    await form.loadSubcategories(this.value);
});
 





 