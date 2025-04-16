-- FirecrawlLauncher.applescript
-- Script to launch the Firecrawl webcrawler and open it in a browser

-- Path to the project directory (update this with the absolute path)
property projectPath : "/Users/ukaoma/Documents/GitHub/firecrawl-webcrawler"

on run
	tell application "Terminal"
		-- Open a new terminal window
		do script "cd " & quoted form of projectPath & " && node server.js"
		-- Set the window title for easy identification
		set custom title of front window to "Firecrawl Server"
	end tell
	
	-- Wait a moment for the server to start
	delay 2
	
	-- Open the browser to the application
	open location "http://localhost:3000"
	
	-- Bring the browser to the front
	try
		tell application "System Events"
			set frontmost of process "Safari" to true
		end tell
	on error
		try
			tell application "System Events"
				set frontmost of process "Google Chrome" to true
			end tell
		on error
			try
				tell application "System Events"
					set frontmost of process "Firefox" to true
				end tell
			end try
		end try
	end try
	
	-- Notify the user
	display notification "Firecrawl webcrawler is now running at http://localhost:3000" with title "Firecrawl Launcher"
end run

on quit
	display dialog "Would you like to stop the Firecrawl server?" buttons {"Keep Running", "Stop Server"} default button "Keep Running"
	if button returned of result is "Stop Server" then
		tell application "Terminal"
			-- Find the terminal window running the server
			repeat with w in windows
				if custom title of w is "Firecrawl Server" then
					-- Send Ctrl+C to stop the server
					set current settings of w to settings set "Basic"
					do script "osascript -e 'tell application \"System Events\" to keystroke \"c\" using control down'" in w
					delay 1
					do script "exit" in w
					exit repeat
				end if
			end repeat
		end tell
	end if
	continue quit
end quit
