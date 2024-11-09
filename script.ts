// Editable Resume Builder - Allows editing after initial creation
class EditableResumeBuilder {
    private readonly formArea: HTMLElement;
    private readonly outputArea: HTMLElement;
    private isEditMode: boolean = false;
    private readonly editableFields: HTMLElement[] = [];

    constructor() {
        this.formArea = document.getElementById('formArea') as HTMLElement;
        this.outputArea = document.getElementById('output') as HTMLElement;
        
        // Initialize all editable fields
        this.initializeEditableFields();
        this.setupEventListeners();                  
    }

    private initializeEditableFields(): void {
        // Add all output fields that should be editable
        const fieldIds = [
            'outputName', 'outputEmail', 'outputPhone',
            'outputSchool', 'outputDegree', 'outputSchool1', 'outputDegree1',
            'outputIns', 'outputRole', 'outputIns1', 'outputRole1',
            'outputSkills', 'outputSkills1', 'outputProjects'
        ];

        fieldIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('editable-field');
                this.editableFields.push(element);
            }
        });
    }

    private setupEventListeners(): void {
        // Setup submit button
        const submitBtn = document.getElementById('submitBtn') as HTMLElement;
        submitBtn.addEventListener('click', () => this.handleInitialSubmit());

        // Create and setup edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit Resume';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => this.toggleEditMode());
        this.outputArea.appendChild(editBtn);

        // Create and setup save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.className = 'save-btn';
        saveBtn.style.display = 'none';
        saveBtn.addEventListener('click', () => this.saveChanges());
        this.outputArea.appendChild(saveBtn);

        // Handle photo editing
        const photoDisplay = document.getElementById('photoDisplay');
        if (photoDisplay) {
            photoDisplay.addEventListener('click', () => {
                if (this.isEditMode) {
                    this.handlePhotoEdit();
                }
            });
        }
    }

    private handleInitialSubmit(): void {
        // Get all input values and display them
        this.updateDisplayFromInputs();
        
        // Show output area and hide form
        this.formArea.style.display = 'none';
        this.outputArea.style.display = 'block';
    }

    private toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        
        // Toggle editability for all fields
        this.editableFields.forEach(field => {
            field.contentEditable = this.isEditMode ? 'true' : 'false';
            field.style.border = this.isEditMode ? '1px dashed #999' : 'none';
            field.style.padding = this.isEditMode ? '5px' : '0';
        });

        // Toggle button visibility
        const editBtn = this.outputArea.querySelector('.edit-btn') as HTMLElement;
        const saveBtn = this.outputArea.querySelector('.save-btn') as HTMLElement;
        
        editBtn.style.display = this.isEditMode ? 'none' : 'block';
        saveBtn.style.display = this.isEditMode ? 'block' : 'none';
    }

    private saveChanges(): void {
        // Validate edited content
        if (this.validateEditedContent()) {
            // Save to local storage for persistence
            this.saveToLocalStorage();
            
            // Exit edit mode
            this.toggleEditMode();
            
            // Show success message
            this.showSaveSuccess();
        }
    }

    private handlePhotoEdit(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        const photoDisplay = document.getElementById('photoDisplay');
                        if (photoDisplay) {
                            photoDisplay.innerHTML = `
                                <img src="${event.target.result}" 
                                     alt="Profile Photo" 
                                     style="width: 150px; height: 150px; border-radius: 50%; 
                                            border: 2px solid #4a90e2; object-fit: cover; 
                                            margin-bottom: 20px;">
                            `;
                        }
                    }
                };
                reader.readAsDataURL(target.files[0]);
            }
        };

        input.click();
    }

    private validateEditedContent(): boolean {
        // Validate email format
        const emailField = document.getElementById('outputEmail');
        if (emailField) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.textContent || '')) {
                alert('Please enter a valid email address');
                return false;
            }
        }

        // Validate required fields
        const requiredFields = ['outputName', 'outputEmail', 'outputPhone'];
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field?.textContent?.trim()) {
                alert(`${fieldId.replace('output', '')} cannot be empty`);
                return false;
            }
        }

        return true;
    }

    private saveToLocalStorage(): void {
        const resumeData = {
            timestamp: new Date().toISOString(),
            fields: {} as { [key: string]: string }
        };

        this.editableFields.forEach(field => {
            resumeData.fields[field.id] = field.textContent || '';
        });

        localStorage.setItem('savedResume', JSON.stringify(resumeData));
    }

    private showSaveSuccess(): void {
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = 'Resume saved successfully!';
        
        this.outputArea.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    private updateDisplayFromInputs(): void {
        // Update all editable fields from form inputs
        Object.keys(this.editableFields).forEach(fieldId => {
            const inputId = fieldId.replace('output', '').toLowerCase();
            const input = document.getElementById(inputId) as HTMLInputElement;
            const output = document.getElementById(fieldId);
            if (input && output) {
                output.textContent = input.value;
            }
        });
    }

    // Method to load previously saved resume
    public loadSavedResume(): void {
        const savedData = localStorage.getItem('savedResume');
        if (savedData) {
            const resumeData = JSON.parse(savedData);
            Object.entries(resumeData.fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value as string;
                }
            });
        }
    }
}

// Initialize the editable resume builder
const editableResume = new EditableResumeBuilder();