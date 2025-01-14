// Handle file input change
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

// Handle category change
async function handleCategoryChange(event) {
    const categoryId = event.target.value;
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
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('files');
    const categorySelect = document.getElementById('categoryUuid');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInput);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }

    // Initialize Bootstrap modals
    document.querySelectorAll('.modal').forEach(modal => {
        new bootstrap.Modal(modal);
    });
});

// Alpine.js functions
function addProductOption() {
    const option = { ...this.currentOption };
    this.productOptions.push(option);
    this.currentOption = { optionName: '', price: '', imageUrl: null };
    this.showOptionModal = false;
}

function addProductField() {
    const field = { ...this.currentField };
    this.productFields.push(field);
    this.currentField = { fieldName: '', fieldType: '', fieldLabel: '' };
    this.showFieldModal = false;
}

function handleOptionImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentOption.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Form submission
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Add product options
    formData.append('productOptions', JSON.stringify(this.productOptions));
    
    // Add product fields
    formData.append('productFields', JSON.stringify(this.productFields));

    try {
        const response = await fetch('/merchant/products/create', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/merchant/products';
        } else {
            alert(data.message || 'Error creating product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating product');
    }
}