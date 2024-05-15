function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
  }

describe('Basic user flow for Notes App', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:5500/index.html'); // Replace with your actual URL
    });
  
    it('Initial Home Page - Check for Add Note button', async () => {
        const addButton = await page.$('#notes-app .add-note');
        expect(addButton).not.toBeNull();
      });
    
      it('Add new note', async () => {
        const addButton = await page.$('#notes-app .add-note');
        await addButton.click();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to be added
        const notes = await page.$$('#notes-app .note');
        expect(notes.length).toBe(1);
    
        // Clean up by removing the added note
        await notes[0].click({ clickCount: 2 }); // Double-click to delete
        await delay(500); // Wait for the note to be deleted
      });
    
      it('Edit new note and save', async () => {
        const addButton = await page.$('#notes-app .add-note');
        await addButton.click();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to be added
        const note = await page.$('#notes-app .note');
    
        await note.click(); // Focus the note
        await note.type('Test note');
        await page.keyboard.press('Tab'); // Click outside to save
        await delay(1000); // Wait for the note to be saved
    
        const noteText = await note.evaluate(note => note.value);
        console.log(noteText)
        expect(noteText).toBe('Test note');
    
        // Clean up by removing the edited note
        await note.click({ clickCount: 2 }); // Double-click to delete
        await delay(5000); // Wait for the note to be deleted
      }, 10000);
    
      it('Edit existing note and save', async () => {
        const addButton = await page.$('#notes-app .add-note');
        await addButton.click();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to be added
        const note = await page.$('#notes-app .note');
    
        await note.click(); // Focus the note
        await note.type('Initial note');
        await page.keyboard.press('Tab'); // Click outside to save
        await delay(500); // Wait for the note to be saved
    
        await note.click(); // Focus again
        await note.type(' edited');
        await page.keyboard.press('Tab'); // Click outside to save
        await delay(500); // Wait for the note to be saved
    
        const noteText = await note.evaluate(note => note.value);
        expect(noteText).toBe('Initial note edited');
    
        // Clean up by removing the edited note
        await note.click({ clickCount: 2 }); // Double-click to delete
        await delay(500); // Wait for the note to be deleted
      });
    
      it('Notes are saved locally', async () => {
        const addButton = await page.$('#notes-app .add-note');
        await addButton.click();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to be added
        const note = await page.$('#notes-app .note');
    
        await note.click(); // Focus the note
        await note.type('Persistent note');
        await page.keyboard.press('Tab'); // Click outside to save
        await delay(500); // Wait for the note to be saved
    
        await page.reload();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to reappear
        const notes = await page.$$('#notes-app .note');
        expect(notes.length).toBe(1);
    
        const noteText = await notes[0].evaluate(note => note.value);
        expect(noteText).toBe('Persistent note');
    
        // Clean up by removing the note
        await notes[0].click({ clickCount: 2 }); // Double-click to delete
        await delay(500); // Wait for the note to be deleted
      });
    
      it('Delete note by double-clicking', async () => {
        const addButton = await page.$('#notes-app .add-note');
        await addButton.click();
        await page.waitForSelector('#notes-app .note'); // Wait for the note to be added
        const note = await page.$('#notes-app .note');
    
        await note.click(); // Focus the note
        await note.type('Note to delete');
        await page.keyboard.press('Tab'); // Click outside to save
        await delay(500); // Wait for the note to be saved
    
        await note.click({ clickCount: 2 }); // Double-click to delete
        await delay(500); // Wait for the note to be deleted
    
        const notes = await page.$$('#notes-app .note');
        expect(notes.length).toBe(0);
      });
  });
  