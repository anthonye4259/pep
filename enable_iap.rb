require 'xcodeproj'

project_path = 'ios/App/App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the App target
target = project.targets.find { |t| t.name == 'App' }

if target
  puts "Found target: #{target.name}"
  
  # Ensure TargetAttributes exists
  project.root_object.attributes['TargetAttributes'] ||= {}
  project.root_object.attributes['TargetAttributes'][target.uuid] ||= {}
  project.root_object.attributes['TargetAttributes'][target.uuid]['SystemCapabilities'] ||= {}
  
  # Enable In-App Purchase
  project.root_object.attributes['TargetAttributes'][target.uuid]['SystemCapabilities']['com.apple.InAppPurchase'] = { 'enabled' => '1' }
  
  project.save
  puts "Successfully enabled In-App Purchase capability."
else
  puts "Target 'App' not found."
end
