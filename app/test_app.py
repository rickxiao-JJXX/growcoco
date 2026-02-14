from playwright.sync_api import sync_playwright
import sys

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    try:
        page.goto('http://localhost:1234', timeout=10000)
        page.wait_for_load_state('networkidle')
        
        page.screenshot(path='screenshot.png', full_page=True)
        
        title = page.title()
        print(f"Page title: {title}")
        
        content = page.content()
        print(f"Page content length: {len(content)}")
        
        root = page.locator('#root')
        if root.count() > 0:
            print("Root element found")
            inner_html = root.inner_html()
            print(f"Root inner HTML length: {len(inner_html)}")
            if inner_html.strip():
                print("Root element has content - App rendered successfully!")
            else:
                print("Root element is empty - App may not have rendered")
        else:
            print("Root element not found")
            
        console_messages = []
        page.on("console", lambda msg: console_messages.append(f"{msg.type}: {msg.text}"))
        
        page.wait_for_timeout(2000)
        
        if console_messages:
            print("\nConsole messages:")
            for msg in console_messages:
                print(f"  {msg}")
                
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        browser.close()
