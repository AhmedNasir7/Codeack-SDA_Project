-- ============================================================================
-- BUG FIXING CHALLENGES DATA
-- ============================================================================
-- Insert 4 bug fixing challenges with buggy code
-- These will be linked to challenges in the main challenge table
-- ============================================================================

-- First, create the challenge records (if they don't exist)
INSERT INTO challenge (
  title,
  description,
  difficulty,
  allowed_languages,
  time_limit,
  created_at,
  updated_at
) VALUES
  (
    'Array Index Out of Bounds',
    'Fix the loop condition causing array overflow',
    'Easy',
    '["Python", "JavaScript", "Java", "C++"]'::jsonb,
    300,
    NOW(),
    NOW()
  ),
  (
    'Null Pointer Exception',
    'Handle null references properly in object access',
    'Medium',
    '["Python", "JavaScript", "Java", "C++"]'::jsonb,
    400,
    NOW(),
    NOW()
  ),
  (
    'String Indexing Error',
    'Fix the string manipulation function',
    'Easy',
    '["Python", "JavaScript", "Java", "C++"]'::jsonb,
    300,
    NOW(),
    NOW()
  ),
  (
    'Race Condition in Threading',
    'Fix synchronization issues in multithreaded code',
    'Hard',
    '["Python", "JavaScript", "Java", "C++"]'::jsonb,
    600,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Now insert the bug fixing challenge records
INSERT INTO bug_fixing_challenge (
  challenge_id,
  buggy_code,
  number_of_bugs,
  expected_output,
  penalty_rules
) VALUES
  (
    (SELECT challenge_id FROM challenge WHERE title = 'Array Index Out of Bounds' LIMIT 1),
    'function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i <= arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

console.log(calculateSum([1, 2, 3, 4, 5]));',
    1,
    '15',
    'Remove 10 points per wrong submission attempt'
  ),
  (
    (SELECT challenge_id FROM challenge WHERE title = 'Null Pointer Exception' LIMIT 1),
    'def process_data(data):
    result = []
    for item in data:
        value = item["key"]
        result.append(value * 2)
    return result

print(process_data([{"key": 5}]))',
    1,
    '[10]',
    'Remove 15 points per wrong submission attempt'
  ),
  (
    (SELECT challenge_id FROM challenge WHERE title = 'String Indexing Error' LIMIT 1),
    'def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = s[i] + result
    return result

print(reverse_string("hello"))',
    1,
    'olleh',
    'Remove 10 points per wrong submission attempt'
  ),
  (
    (SELECT challenge_id FROM challenge WHERE title = 'Race Condition in Threading' LIMIT 1),
    'import threading

counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

t1.start()
t2.start()

t1.join()
t2.join()

print(counter)',
    2,
    '200000',
    'Remove 25 points per wrong submission attempt'
  )
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'Bug Fixing Challenges inserted successfully' as status;
