// Test Script for Study Buddy Pro
// Run this in the DevTools Console (Ctrl+Shift+I) to verify all features

console.log('🧪 Starting Study Buddy Pro Feature Test...\n');

async function runTests() {
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function test(name, condition) {
        if (condition) {
            console.log(`✅ ${name}`);
            results.passed++;
            results.tests.push({ name, status: 'PASS' });
        } else {
            console.error(`❌ ${name}`);
            results.failed++;
            results.tests.push({ name, status: 'FAIL' });
        }
    }

    // Module existence tests
    console.log('\n📦 Testing Module Availability...');
    test('Dashboard module exists', typeof Dashboard !== 'undefined');
    test('Summarizer module exists', typeof Summarizer !== 'undefined');
    test('ProblemGenerator module exists', typeof ProblemGenerator !== 'undefined');
    test('StudyOptimizer module exists', typeof StudyOptimizer !== 'undefined');
    test('Flashcards module exists', typeof Flashcards !== 'undefined');
    test('ReverseQuiz module exists', typeof ReverseQuiz !== 'undefined');
    test('PomodoroModule exists', typeof PomodoroModule !== 'undefined');
    test('Settings module exists', typeof Settings !== 'undefined');

    // IPC communication tests
    console.log('\n🔌 Testing IPC Communication...');
    try {
        const settings = await window.ipcRenderer.invoke('get-settings');
        test('IPC: get-settings works', settings !== null);
    } catch (e) {
        test('IPC: get-settings works', false);
    }

    try {
        const stats = await window.ipcRenderer.invoke('db-get-stats');
        test('IPC: db-get-stats works', stats !== null);
        console.log('   📊 Stats:', stats);
    } catch (e) {
        test('IPC: db-get-stats works', false);
    }

    try {
        const sessions = await window.ipcRenderer.invoke('db-get-sessions', 5);
        test('IPC: db-get-sessions works', Array.isArray(sessions));
        console.log(`   📝 Found ${sessions.length} sessions`);
    } catch (e) {
        test('IPC: db-get-sessions works', false);
    }

    try {
        const flashcards = await window.ipcRenderer.invoke('db-get-flashcards');
        test('IPC: db-get-flashcards works', Array.isArray(flashcards));
        console.log(`   🎴 Found ${flashcards.length} flashcards`);
    } catch (e) {
        test('IPC: db-get-flashcards works', false);
    }

    // DOM tests
    console.log('\n🎨 Testing UI Elements...');
    test('Module container exists', document.getElementById('module-container') !== null);
    test('Loading overlay exists', document.getElementById('loading-overlay') !== null);
    test('Toast notification exists', document.getElementById('toast') !== null);
    test('Navigation buttons exist', document.querySelectorAll('.nav-btn').length > 0);

    // Function tests
    console.log('\n⚡ Testing Global Functions...');
    test('loadModule function exists', typeof loadModule === 'function');
    test('showToast function exists', typeof showToast === 'function');
    test('showLoading function exists', typeof showLoading === 'function');
    test('hideLoading function exists', typeof hideLoading === 'function');

    // Theme test
    console.log('\n🎨 Testing Theme System...');
    const bodyClasses = document.body.className;
    test('Theme class applied', bodyClasses.includes('theme-'));

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    if (results.failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! App is ready for deployment.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the results above.');
    }

    return results;
}

// Run the tests
runTests().then(results => {
    console.log('\n✨ Test suite complete!');
    console.log('💡 To test a specific module, use: loadModule("module-name")');
    console.log('📍 Available modules: dashboard, summarizer, problems, optimizer, flashcards, quiz, pomodoro, settings, about');
});
