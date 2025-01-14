// Initialize Alpine.js data
document.addEventListener('alpine:init', () => {
    Alpine.data('productForm', () => ({
        productOptions: [],
        productFields: [],
        currentOption: { optionName: '', price: '', imageUrl: null },
        currentField: { fieldLabel: '', fieldType: '' },
        selectedCurrency: 'GHS',
        
        init() {
            // Initialize Bootstrap modals
            $('#optionModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
            
            $('#fieldModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
        },

        openOptionModal() {
            this.currentOption = { optionName: '', price: '', imageUrl: null };
            $('#optionModal').modal('show');
        },

        openFieldModal() {
            this.currentField = { fieldLabel: '', fieldType: '' };
            $('#fieldModal').modal('show');
        },

        addProductOption() {
            console.log('Adding product option:', this.currentOption);
            
            if (!this.currentOption.optionName || !this.currentOption.price) {
                alert('Please fill in both option name and price');
                return;
            }

            this.productOptions.push({
                optionName: this.currentOption.optionName,
                price: parseFloat(this.currentOption.price),
                imageUrl: this.currentOption.imageUrl
            });

            // Reset form and close modal
            this.currentOption = { optionName: '', price: '', imageUrl: null };
            $('#optionModal').modal('hide');
        },

        addProductField() {
            console.log('Adding product field:', this.currentField);
            
            if (!this.currentField.fieldLabel || !this.currentField.fieldType) {
                alert('Please fill in both field label and type');
                return;
            }

            this.productFields.push({
                fieldLabel: this.currentField.fieldLabel,
                fieldType: this.currentField.fieldType
            });

            // Reset form and close modal
            this.currentField = { fieldLabel: '', fieldType: '' };
            $('#fieldModal').modal('hide');
        },

        removeOption(index) {
            this.productOptions.splice(index, 1);
        },

        removeField(index) {
            this.productFields.splice(index, 1);
        },

        handleOptionImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentOption.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async handleSubmit(event) {
            event.preventDefault();
            
            try {
                const form = event.target;
                const formData = new FormData(form);

                // Add product options and fields to form data
                formData.append('productOptions', JSON.stringify(this.productOptions));
                formData.append('productFields', JSON.stringify(this.productFields));

                // Log the data being sent
                console.log('Submitting product with options:', this.productOptions);
                console.log('Submitting product with fields:', this.productFields);

                const response = await fetch('/merchant/products/create', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Show success message
                    alert('Product created successfully!');
                    // Redirect to products page
                    window.location.href = '/merchant/products';
                } else {
                    throw new Error(data.message || 'Failed to create product');
                }
            } catch (error) {
                console.error('Error creating product:', error);
                alert(error.message || 'Error creating product. Please try again.');
            }
        }
    }));
});

// Handle file input change for product images
function handleFileInput(event) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-image';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(div);
        }
        reader.readAsDataURL(file);
    });

    // Update file input label
    const fileCount = event.target.files.length;
    const label = event.target.nextElementSibling;
    label.textContent = fileCount > 1 ? `${fileCount} files selected` : event.target.files[0].name;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('files');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInput);
    }

    // Handle category change
    const categorySelect = document.getElementById('categoryUuid');
    if (categorySelect) {
        categorySelect.addEventListener('change', async function(e) {
            const categoryId = e.target.value;
            const subCategorySelect = document.getElementById('subCategoryUuid');
            
            if (!categoryId) {
                subCategorySelect.disabled = true;
                subCategorySelect.innerHTML = '<option value="">Select a category first</option>';
                return;
            }

            try {
                const response = await fetch(`/api/productsubcategory/product/${categoryId}`);
                const data = await response.json();
                
                subCategorySelect.innerHTML = '<option value="">Select a sub category</option>';
                data.data.forEach(subCat => {
                    subCategorySelect.innerHTML += `
                        <option value="${subCat.uuid}">${subCat.name}</option>
                    `;
                });
                subCategorySelect.disabled = false;
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                alert('Error loading subcategories');
            }
        });
    }
});