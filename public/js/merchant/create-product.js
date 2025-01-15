// Ensure to include the sweetAlertUtils.js file in your HTML
// <script src="/js/sweet-alert-utils.js></script>

function productForm() {
	return {
		productOptions: [],
		productFields: [],
		currentOption: { optionName: '', price: '', imageUrl: null },
		currentField: { fieldLabel: '', fieldType: '' },
		selectedCurrency: 'GHS',

		// Fetch subcategories based on selected category
		fetchSubcategories() {
			const categoryUuid = document.getElementById('categoryUuid').value;
			const subCategorySelect = document.getElementById('subCategoryUuid');

			// Clear existing subcategories
			subCategorySelect.innerHTML = '<option value="">Select a subcategory</option>';

			if (categoryUuid) {
				fetch(`/api/product/subcategories/${categoryUuid}`)
					.then(response => response.json())
					.then(data => {
						if (data.status === "success") {
							data.data.forEach(subcategory => {
								const option = document.createElement('option');
								option.value = subcategory.uuid;
								option.textContent = subcategory.name;
								subCategorySelect.appendChild(option);
							});
						} else {
							console.error(data.message);
						}
					})
					.catch(error => {
						console.error('Error fetching subcategories:', error);
					});
			}
		},

		openOptionModal() {
			$('#optionModal').modal('show');
		},

		openFieldModal() {
			$('#fieldModal').modal('show');
		},

		addProductOption() {
			if (this.currentOption.optionName && this.currentOption.price) {
				this.productOptions.push({...this.currentOption});
				this.currentOption = { optionName: '', price: '', imageUrl: null };
				$('#optionModal').modal('hide');
			}
		},

		addProductField() {
			alert("add field clicked");
			if (this.currentField.fieldLabel && this.currentField.fieldType) {
				this.productFields.push({...this.currentField});
				this.currentField = { fieldLabel: '', fieldType: '' };
				$('#fieldModal').modal('hide');
			}
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

		handleSubmit(event) {
			console.log("Submitting form with data:", {
				productOptions: this.productOptions,
				productFields: this.productFields,
				selectedCurrency: this.selectedCurrency,
				currentOption: this.currentOption,
				currentField: this.currentField
			});

			const formData = new FormData(event.target);
			formData.append('productOptions', JSON.stringify(this.productOptions));
			formData.append('productFields', JSON.stringify(this.productFields));

			fetch('/merchant/product/create', {
				method: 'POST',
				body: formData
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						// Use the utility function for success alert
						showSuccessAlert('Success!', 'Product created successfully!');
						// Reset the form fields
						this.resetForm();
					} else {
						// Use the utility function for error alert
						showErrorAlert('Error!', data.message || 'Error creating product');
					}
				})
				.catch(error => {
					console.log('Error:', error);
					// Use the utility function for error alert
					showErrorAlert('Error!', 'Error creating product');
				});
		},

		// New method to reset form fields
		resetForm() {
			this.productOptions = [];
			this.productFields = [];
			this.currentOption = { optionName: '', price: '', imageUrl: null };
			this.currentField = { fieldLabel: '', fieldType: '' };
			document.getElementById('createProductForm').reset(); // Reset the form fields
		}
	}
}

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
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
	const fileInput = document.getElementById('files');
	if (fileInput) {
		fileInput.addEventListener('change', handleFileInput);
	}

	const categorySelect = document.getElementById('categoryUuid');
	if (categorySelect) {
		categorySelect.addEventListener('change', function() {
			productForm().fetchSubcategories();
		});
	}
});
